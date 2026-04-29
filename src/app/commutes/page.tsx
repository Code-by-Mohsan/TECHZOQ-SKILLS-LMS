export default function CommutesPage() {
  return (
    <div
      className="commutes-wrapper"
      style={{ height: "100vh", width: "100%" }}
    >
      <iframe
        src="/commutes.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Commutes and Destinations Map"
      />
    </div>
  );
}
