import './index.css'
import {useState} from 'react'

const FilterJobs = props => {
  const {
    salaryRangesList,
    employmentTypesList,
    updateEmploymentFilter,
    updateSalaryFilter,
  } = props
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([])
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('')

  const handleEmploymentTypeChange = event => {
    const {value} = event.target

    const updatedSelectedEmploymentTypes = selectedEmploymentType.includes(
      value,
    )
      ? selectedEmploymentType.filter(type => type !== value)
      : [...selectedEmploymentType, value]

    setSelectedEmploymentType(updatedSelectedEmploymentTypes)

    const employmentTypeIdsString = updatedSelectedEmploymentTypes.join(',')
    updateEmploymentFilter(employmentTypeIdsString)
  }

  const handleSalaryRangeChange = event => {
    const {value} = event.target
    updateSalaryFilter(value)
    setSelectedSalaryRange(value)
  }
  return (
    <>
      <h1 className="employment-heading">Type of Employment</h1>
      <ul className="filters-list-container">
        {employmentTypesList.map(eachType => (
          <li className="filter-item-container" key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              className="checkbox-input"
              value={eachType.employmentTypeId}
              onChange={handleEmploymentTypeChange}
            />
            <label
              htmlFor={eachType.employmentTypeId}
              className="checkbox-label"
            >
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
      <hr />
      <h1 className="employment-heading">Salary Range</h1>
      <ul className="filters-list-container">
        {salaryRangesList.map(eachSalary => (
          <li className="filter-item-container" key={eachSalary.salaryRangeId}>
            <input
              type="radio"
              id={eachSalary.salaryRangeId}
              className="checkbox-input"
              onChange={handleSalaryRangeChange}
              value={eachSalary.salaryRangeId}
              checked={eachSalary.salaryRangeId === selectedSalaryRange}
            />
            <label
              htmlFor={eachSalary.salaryRangeId}
              className="checkbox-label"
            >
              {eachSalary.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )
}

export default FilterJobs
