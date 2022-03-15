import { PlusSmIcon } from '@heroicons/react/solid'

const Header = ({ uploadPhoto, signOut }) => {

  return (
    <header>
      <nav>
        <div className="flex-1 flex justify-start">
          <h1>Photo Inspector</h1>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            type="button"
            onClick={uploadPhoto}
            className="accent-button">
            <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            <span>Upload Photo</span>
          </button>
        </div>
      </nav>
    </header>
  )

}

export default Header;
