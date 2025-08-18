export default function SearchBar({value, onChange, placeholder}) { 
    return (
        <>
        <input data-test="search-bar" className="search-bar" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}></input>
        </>
    )
}