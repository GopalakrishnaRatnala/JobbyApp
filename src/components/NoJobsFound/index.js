import './index.css'

const NoJobsFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      alt="no jobs"
      className="not-found-img"
    />
    <h1 className="not-found-heading">No Jobs Found</h1>
    <p className="not-found-description">
      We could not find any jobs. Try other filters.
    </p>
  </div>
)

export default NoJobsFound
