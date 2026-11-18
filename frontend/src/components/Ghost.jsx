import { GHOST } from "../content/ghost.js";
import { DEMO_MODE, DEMO } from "../content/demo.jsx";

// When DEMO_MODE is on, show the sample content for this id.
// When it is off, show the yellow placeholder box that says what is missing.
export default function Ghost({ id }) {
  if (DEMO_MODE && DEMO[id] !== undefined) return DEMO[id];

  const item = GHOST[id];
  if (!item) return <div className="ghost">Missing ghost entry: {id}</div>;

  return (
    <div className="ghost">
      <span className="ghost-tag">TO ADD</span>
      <p className="ghost-label">{item.label}</p>
      <small className="ghost-where">Goes in: {item.where}</small>
    </div>
  );
}
