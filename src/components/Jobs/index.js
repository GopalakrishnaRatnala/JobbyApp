import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import './index.css'

import Header from '../Header'
import Profile from '../Profile'
import JobCard from '../JobCard'
import FilterJobs from '../FilterJobs'
import NoJobsFound from '../NoJobsFound'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobsList: [],
      employmentTypeFilter: '',
      minimumPackageFilter: '',
      searchFilter: '',
      apiStatus: apiStatusConstants.initial,
    }
  }

  componentDidMount() {
    this.getJobsData()
  }

  updateEmploymentFilter = employmentFilterValue => {
    this.setState(
      {employmentTypeFilter: employmentFilterValue},
      this.getJobsData,
    )
  }

  updateSalaryFilter = salaryFilterValue => {
    this.setState({minimumPackageFilter: salaryFilterValue}, this.getJobsData)
  }

  getJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {
      minimumPackageFilter,
      searchFilter,
      employmentTypeFilter,
    } = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeFilter}&minimum_package=${minimumPackageFilter}&search=${searchFilter}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 400) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <Link to="/jobs">
        <button type="button" className="retry-button">
          Retry
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    console.log(jobsList)
    return jobsList.length !== 0 ? (
      <ul className="jobs-list-container">
        {jobsList.map(eachJobItem => (
          <JobCard eachJobItem={eachJobItem} key={eachJobItem.id} />
        ))}
      </ul>
    ) : (
      <NoJobsFound />
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    if (event.key === 'Enter') {
      this.setState({searchFilter: event.target.value}, this.getJobsData)
    } else {
      this.setState({searchFilter: event.target.value})
    }
  }

  onClickButton = () => {
    const {searchFilter} = this.state
    this.setState({searchFilter}, this.getJobsData)
  }

  renderSearchInput = () => {
    const {searchFilter} = this.state
    return (
      <div className="search-input-container">
        <input
          value={searchFilter}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onChangeSearchInput}
        />
        <button
          className="searchButton"
          type="button"
          onClick={this.onClickButton}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
          {}
        </button>
      </div>
    )
  }

  render() {
    const {salaryRangesList, employmentTypesList} = this.props
    return (
      <>
        <Header />
        <div className="job-profile-container">
          <div className="profile-filters-container">
            {this.renderSearchInput()}
            <Profile />
            <hr />
            <FilterJobs
              salaryRangesList={salaryRangesList}
              employmentTypesList={employmentTypesList}
              updateEmploymentFilter={this.updateEmploymentFilter}
              updateSalaryFilter={this.updateSalaryFilter}
            />
          </div>
          <div>{this.renderJobDetails()}</div>
        </div>
      </>
    )
  }
}

export default Jobs
