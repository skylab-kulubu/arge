import assert from "node:assert/strict";
import { test } from "node:test";

import { CMS_IMAGE_MAX_BYTES, coreMediaUrl, uploadCmsImage } from "../src/lib/cms-media.js";

const TARGET = "https://api.yildizskylab.com/v1/media";
const editor = { accessToken: "editor-token", user: { clientRoles: ["cms:access"] } };
const isEditor = (session) => session.user.clientRoles.includes("cms:access");

function upload({ file = new File([new Uint8Array(8)], "logo.png", { type: "image/png" }), headers = {}, extra } = {}) {
  const form = new FormData();
  if (file) form.append("file", file);
  if (extra) for (const [k, v] of Object.entries(extra)) form.append(k, v);
  return new Request("https://arge.yildizskylab.com/api/cms-media", {
    method: "POST",
    headers: { authorization: "Bearer editor-token", ...headers },
    body: form,
  });
}

function recorder(answer = { id: "m1", url: "https://cdn.yildizskylab.com/images/m1.png" }, status = 201) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return Response.json(answer, { status });
  };
  return { calls, fetchImpl };
}

test("uploads go to core's origin, whatever path API_BASE_URL carries", () => {
  assert.equal(coreMediaUrl("https://api.yildizskylab.com", "https://x.example/api"), TARGET);
  assert.equal(
    coreMediaUrl("https://sandbox-api.yildizskylab.com/v1/", "https://x.example/api"),
    "https://sandbox-api.yildizskylab.com/v1/media",
  );
});

test("without API_BASE_URL the CMS host names core", () => {
  assert.equal(coreMediaUrl(undefined, "https://api.yildizskylab.com/api"), TARGET);
  assert.equal(coreMediaUrl("", "http://localhost:5000"), "http://localhost:5000/v1/media");
});

test("an editor's image goes to core with the session's token and comes back as { data }", async () => {
  const { calls, fetchImpl } = recorder();
  const res = await uploadCmsImage(upload({ headers: { authorization: "Bearer stale-token" } }), {
    session: editor,
    isEditor,
    target: TARGET,
    fetchImpl,
  });
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), {
    data: { id: "m1", url: "https://cdn.yildizskylab.com/images/m1.png" },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, TARGET);
  assert.equal(calls[0].init.headers.authorization, "Bearer editor-token");
  const sent = calls[0].init.body;
  assert.equal(sent.get("file").name, "logo.png");
  assert.equal(sent.get("file").type, "image/png");
});

test("only the file reaches core: a purpose in the form is dropped", async () => {
  const { calls, fetchImpl } = recorder();
  await uploadCmsImage(upload({ extra: { purpose: "answer_file" } }), {
    session: editor,
    isEditor,
    target: TARGET,
    fetchImpl,
  });
  assert.deepEqual([...calls[0].init.body.keys()], ["file"]);
});

for (const [name, session] of [
  ["signed out", null],
  ["a failed token refresh", { ...editor, error: "RefreshAccessTokenError", accessToken: undefined }],
]) {
  test(`${name}: 401, nothing reaches core`, async () => {
    const { calls, fetchImpl } = recorder();
    const res = await uploadCmsImage(upload(), { session, isEditor, target: TARGET, fetchImpl });
    assert.equal(res.status, 401);
    assert.equal(calls.length, 0);
  });
}

test("a signed-in member without cms:access: 403, nothing reaches core", async () => {
  const { calls, fetchImpl } = recorder();
  const member = { accessToken: "member-token", user: { clientRoles: [] } };
  const res = await uploadCmsImage(upload(), { session: member, isEditor, target: TARGET, fetchImpl });
  assert.equal(res.status, 403);
  assert.equal(calls.length, 0);
});

test("no Authorization header (a cross-site form riding the cookie): 401", async () => {
  const { calls, fetchImpl } = recorder();
  const req = upload();
  const bare = new Request(req.url, { method: "POST", body: await req.formData() });
  const res = await uploadCmsImage(bare, { session: editor, isEditor, target: TARGET, fetchImpl });
  assert.equal(res.status, 401);
  assert.equal(calls.length, 0);
});

test("a file other than JPEG, PNG, WebP, GIF or SVG: 415", async () => {
  const { calls, fetchImpl } = recorder();
  const pdf = new File([new Uint8Array(8)], "doc.pdf", { type: "application/pdf" });
  const res = await uploadCmsImage(upload({ file: pdf }), { session: editor, isEditor, target: TARGET, fetchImpl });
  assert.equal(res.status, 415);
  assert.equal(calls.length, 0);
});

test("an image over 10 MiB: 413", async () => {
  const { calls, fetchImpl } = recorder();
  const big = new File([new Uint8Array(CMS_IMAGE_MAX_BYTES + 1)], "big.png", { type: "image/png" });
  const res = await uploadCmsImage(upload({ file: big }), { session: editor, isEditor, target: TARGET, fetchImpl });
  assert.equal(res.status, 413);
  assert.equal(calls.length, 0);
});

test("a declared body far over the limit is refused before it is read: 413", async () => {
  const { calls, fetchImpl } = recorder();
  const req = upload({ headers: { "content-length": String(CMS_IMAGE_MAX_BYTES * 2) } });
  const res = await uploadCmsImage(
    { headers: req.headers, formData: () => assert.fail("read the body") },
    { session: editor, isEditor, target: TARGET, fetchImpl },
  );
  assert.equal(res.status, 413);
  assert.equal(calls.length, 0);
});

test("a form without a file: 400", async () => {
  const { calls, fetchImpl } = recorder();
  const res = await uploadCmsImage(upload({ file: null }), { session: editor, isEditor, target: TARGET, fetchImpl });
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test("core's refusal comes back as is, with its status and detail", async () => {
  const { fetchImpl } = recorder({ title: "Unauthorized", detail: "token audience" }, 401);
  const res = await uploadCmsImage(upload(), { session: editor, isEditor, target: TARGET, fetchImpl });
  assert.equal(res.status, 401);
  assert.equal((await res.json()).detail, "token audience");
});

test("core unreachable: 502 with a detail the editor shows", async () => {
  const res = await uploadCmsImage(upload(), {
    session: editor,
    isEditor,
    target: TARGET,
    fetchImpl: async () => {
      throw new TypeError("fetch failed");
    },
  });
  assert.equal(res.status, 502);
  assert.ok((await res.json()).detail);
});
