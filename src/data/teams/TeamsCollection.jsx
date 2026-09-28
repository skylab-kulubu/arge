"use client";

import { useMemo } from "react";
import { CollectionRegion } from "inscribed/collections";
import { teamsFromItems } from "./fromCollection.js";

// inscribed only knows lowercase collection keys (^[a-z0-9]+(-[a-z0-9]+)*$)
// and answers 404 to the old cms-backend's "Teams".
const TEAMS_COLLECTION_KEY = "teams";

function TeamsBinding({ items, meta, children }) {
  const teams = useMemo(() => teamsFromItems(items), [items]);
  return children(teams, meta);
}

export default function TeamsCollection({ blockPath = "teams", children }) {
  return (
    <CollectionRegion blockPath={blockPath} collection={TEAMS_COLLECTION_KEY} limit={9}>
      {(items, meta) => (
        <TeamsBinding items={items} meta={meta}>
          {children}
        </TeamsBinding>
      )}
    </CollectionRegion>
  );
}