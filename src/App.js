import React from "react";

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

function System(props) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  const Component = React.lazy(
    loadComponent(props.system.scope, props.system.module)
  );

  return (
    <React.Suspense fallback="Loading System">
      <Component />
    </React.Suspense>
  );
}

function App() {
  const [system, setSystem] = React.useState(undefined);

  function setApp2() {
    setSystem({
      url: "https://module-federation-1.netlify.app/remoteEntry.js",
      scope: "app2",
      module: "./Widget",
    });
  }

  function setApp3() {
    setSystem({
      url: "https://module-federation-2.netlify.app/remoteEntry.js",
      scope: "app3",
      module: "./Widget",
    });
  }

  return (
    <div className="font-sans antialiased h-screen flex">
  {/* Sidebar / channel list */}
  <div className="bg-indigo-darkest text-purple-lighter flex-none w-24 p-6 hidden md:block">
    <div onClick={setApp2} className="cursor-pointer mb-4">
    <div className="bg-indigo-lighter opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
        D
      </div>
      <div className="text-center text-white opacity-50 text-sm">⌘1</div>
    </div>
    <div onClick={setApp3} className="cursor-pointer mb-4">
      <div className="bg-indigo-lighter opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
        L
      </div>
      <div className="text-center text-white opacity-50 text-sm">⌘2</div>
    </div>
    <div className="cursor-pointer">
      <div className="bg-white opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
        <svg className="fill-current h-10 w-10 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" /></svg>
      </div>
    </div>
  </div>
  <div className="bg-indigo-darker text-purple-lighter flex-none w-64 pb-6 hidden md:block">
    <div className="text-white mb-2 mt-3 px-4 flex justify-between">
      <div className="flex-auto">
        <h1 className="font-semibold text-xl leading-tight mb-1 truncate">Module Federation</h1>
        {/* <div className="flex items-center mb-6">
          <span className="bg-green rounded-full block w-2 h-2 mr-2" />
          <span className="text-white opacity-50 text-sm">Dashoboard</span>
        </div> */}
      </div>
      <div>
        <svg className="h-6 w-6 fill-current text-white opacity-25" viewBox="0 0 20 20">
          <path d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z" fillRule="evenodd" />
        </svg>
      </div>
    </div>
    {/* <div className="mb-8">
      <div className="px-4 mb-2 text-white flex justify-between items-center">
        <div className="opacity-75">Channels</div>
        <div>
          <svg className="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </div>
      </div>
      <div className="bg-teal-dark py-1 px-4 text-white"># general</div>
    </div> */}
    {/* <div className="mb-8">
      <div className="px-4 mb-2 text-white flex justify-between items-center">
        <div className="opacity-75">Direct Messages</div>
        <div>
          <svg className="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </div>
      </div>
      <div className="flex items-center mb-3 px-4">
        <span className="bg-green rounded-full block w-2 h-2 mr-2" />
        <span className="text-white opacity-75">Adam Wathan <span className="text-grey text-sm">(you)</span></span>
      </div>
      <div className="flex items-center mb-3 px-4">
        <span className="bg-green rounded-full block w-2 h-2 mr-2" />
        <span className="text-white opacity-75">David Hemphill</span>
      </div>
      <div className="flex items-center px-4 mb-6 opacity-50">
        <span className="border border-white rounded-full w-2 h-2 mr-2" />
        <span className="text-white">Steve Schoger</span>
      </div>
    </div> */}
    <div>
      <div className="px-4 mb-2 text-white flex justify-between items-center">
        <div className="opacity-75">Apps</div>
        <div>
          <svg className="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
  {/* Chat content */}
  <div className="flex-1 flex flex-col bg-white overflow-hidden">
    {/* Top bar */}
    <div className="border-b flex px-6 py-2 items-center flex-none">
      <div className="flex flex-col">
        <h3 className="text-grey-darkest mb-1 font-extrabold"></h3>
        <div className="text-grey-dark text-sm truncate">
            {/* Chit-chattin' about ugly HTML and mixing of concerns. */}
        </div>
      </div>
      <div className="ml-auto hidden md:block">
        <div className="relative">
          <input type="search" placeholder="Search" className="appearance-none border border-grey rounded-lg pl-8 pr-4 py-2" />
          <div className="absolute pin-y pin-l pl-3 flex items-center justify-center">
            <svg className="fill-current text-grey h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    {/* Chat messages */}
    <div className="px-6 py-4 flex-1 overflow-y-scroll">
      {/* A message */}
      <System system={system} />
    </div>
    {/* <div className="pb-6 px-4 flex-none">
      <div className="flex rounded-lg border-2 border-grey overflow-hidden">
        <span className="text-3xl text-grey border-r-2 border-grey p-2">
          <svg className="fill-current h-6 w-6 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" /></svg>
        </span>
        <input type="text" className="w-full px-4" placeholder="Message #general" />
      </div>
    </div> */}
  </div>
</div>

  );
}

export default App;
