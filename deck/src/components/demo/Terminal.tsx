"use client";

export default function Terminal() {
  return (
    <div className="demo-pane">
      <iframe src="http://localhost:7681/" className="app-frame" title="Terminal" />
    </div>
  );
}
