export default function SearchBar({value, onChange, placeholder}) { 
    return (
        <>
        <input className="search-bar" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}></input>
        </>
    )
}