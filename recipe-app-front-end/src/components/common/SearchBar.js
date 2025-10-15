export default function SearchBar({value, changeValue, placeholder}) {
    return (
        <div className="search-container">
        <input data-test="search-bar" className="search-bar" value={value} placeholder={placeholder} onChange={(e) => changeValue(e.target.value)}></input>
        <button data-test="search-bar-clear" className="clear-button" onClick={() => changeValue("")}>✕</button>
        </div>
    )
}