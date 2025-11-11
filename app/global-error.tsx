"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to external monitoring service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{ textAlign: "center", maxWidth: "32rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Application Error
            </h1>
            <p style={{ color: "#666", marginBottom: "2rem" }}>
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            {error.digest && (
              <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "2rem" }}>
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                background: "#FF6B2C",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

