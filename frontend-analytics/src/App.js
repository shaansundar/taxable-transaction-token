function App() {
  return (
    <div className="bg-black h-screen w-screen flex flex-col items-center justify-start">
      <header className="flex text-white items-center justify-between w-full h-20 p-6">
        <h1 className="text-3xl">
          Taxable Tx
        </h1>
        <h1 className="font-bold">
          Analytics Dashboard
        </h1>
        <button className="w-36 h-10 bg-yellow-600">
          Connect Wallet
        </button>
      </header>
      <section className="flex items-center justify-start p-5 w-full h-full">
        <div className="rounded-xl bg-yellow-600 w-1/2 h-full">

        </div>
      </section>
    </div>
  );
}

export default App;
