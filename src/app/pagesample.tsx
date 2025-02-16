import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="m-5 p-5 ">
        <h1>Round</h1>
        <div id="round">1</div>
        <form action="/api" method="POST">
          <input type="text" name="Enter a number" id="textnumber" />
          <input type="submit" value="Click to Submit" />
        </form>
      </main>
    </>
  );
}
