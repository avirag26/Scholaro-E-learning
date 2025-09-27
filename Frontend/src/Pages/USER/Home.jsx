import React from "react";

function HomePage() {
  const welcomeMessage = "Welcome to the Home Page!";
  const description = "This is a simple React component using JSX.";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{welcomeMessage}</h1>
      <p>{description}</p>
      <button onClick={() => alert("Button clicked!")}>Click me</button>
    </div>
  );
}

export default HomePage;
