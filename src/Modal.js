import React from 'react'

const Modal = ({ close, apps, setListedApps }) => {
  const addService = (name) => {
    const elementsIndex = apps.findIndex(app => app.name == name)
    let newApps = [...apps];
    newApps[elementsIndex] = { ...newApps[elementsIndex], active: !newApps[elementsIndex].active }
    setListedApps(newApps)
  }
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-teal-lightest font-sans">
      <div>
        <div className="bg-white rounded shadow p-8 m-4 max-w-xs max-h-full text-center overflow-y-scroll">
          <div className="flex items-center w-full">
            <div className="text-gray-900 font-medium text-lg">Add Service</div>
            <svg onClick={close} className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
          <div>

            {apps.map(app => (
              <div onClick={() => addService(app.name)} className="max-w-screen-lg bg-black shadow-2xl rounded-lg mx-auto text-center py-12 mt-4 ">
                <h2 className="text-3xl leading-9 font-bold tracking-tight text-white sm:text-4xl sm:leading-10 px-3">
                  {app.name}
                </h2>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-md bg-white shadow">
                    <button className="text-gray-700 font-bold py-2 px-6">
                      {app.active ? 'Remove' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}



          </div>

        </div>
      </div>
    </div>

  )
}

export default Modal
