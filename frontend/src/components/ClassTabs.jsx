export default function ClassTabs({ classes, value, onChange }) {
  return (
    <div className="class-selector">
      {classes.map((x) => (
        <button className={x === value ? "current" : ""} onClick={() => onChange(x)} key={x}>{x}</button>
      ))}
    </div>
  );
}
