import { ChangeEvent, KeyboardEvent, useState } from 'react'
interface Props {
  value?: string
  onChange?: (option: string) => void
  onSelect: (option: string) => void
  options: string[]
  containerClass: string
}
//onSelect will return the string of the option chosen, pass your own function into it so it lifts it to the parent
export default function DropDownAutoFilter({
  value,
  onChange,
  onSelect,
  options,
  containerClass,
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const [showDropDown, setShowDropDown] = useState(false)
  const [shortList, setShortList] = useState(options)

  const handleOnFocus = () => {
    setShowDropDown(true)
    if (inputValue === '') setShortList(options)
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (onChange) onChange(value)
    else setInputValue(value)
    
    const newShortList: string[] = []
    options.forEach((option) => {
      if (
        option.toLowerCase().includes(value.toLowerCase()) &&
        value.toLowerCase() !== option.toLowerCase()
      )
        newShortList.push(option)
    })
    setShortList(newShortList)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSelect(inputValue)
  }

  const handleSelect = (option: string) => {
    setInputValue('')
    setShowDropDown(false)
    setShortList(options)
    onSelect(option)
  }

  const handleOnBlur = () => {
    setTimeout(() => setShowDropDown(false), 100)
    if (inputValue !== '') handleSelect(inputValue)
  }
  
  return (
    <div className={`container relative ${containerClass || ''}`}>
      <input
        name="dropDown"
        className={`w-full rounded bg-white pl-1 italic`}
        value={value || inputValue}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {showDropDown && shortList && (
        <div className="container absolute z-50 w-full border-b-[1px] border-l-[1px] border-r-[1px] border-black bg-white">
          {shortList.map((option, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left"
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
