import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoStarSharp} from 'react-icons/io5'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsData: {},
    similarJobsData: [],
    skillsList: [],
    lifeAtCompanyObj: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJodItemDetails()
  }

  getJodItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedGetObject = {
        JobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      const formattedLifeAtCompanyObj = {
        description: formattedGetObject.JobDetails.life_at_company.description,
        imageUrl: formattedGetObject.JobDetails.life_at_company.image_url,
      }

      const FormattedSkillsArray = formattedGetObject.JobDetails.skills.map(
        eachSkills => ({
          imageUrl: eachSkills.image_url,
          name: eachSkills.name,
        }),
      )

      const formattedSimilarJobsData = formattedGetObject.similarJobs.map(
        eachSimilarObj => ({
          companyLogoUrl: eachSimilarObj.company_logo_url,
          employmentType: eachSimilarObj.employment_type,
          id: eachSimilarObj.id,
          jobDescription: eachSimilarObj.job_description,
          location: eachSimilarObj.location,
          rating: eachSimilarObj.rating,
          title: eachSimilarObj.title,
        }),
      )

      const formattedJobDetails = {
        companyLogoUrl: formattedGetObject.JobDetails.company_logo_url,
        companyWebsiteUrl: formattedGetObject.JobDetails.company_website_url,
        employmentType: formattedGetObject.JobDetails.employment_type,
        id: formattedGetObject.JobDetails.id,
        jobDescription: formattedGetObject.JobDetails.job_description,
        lifeAtCompany: formattedLifeAtCompanyObj,
        location: formattedGetObject.JobDetails.location,
        packagePerAnnum: formattedGetObject.JobDetails.package_per_annum,
        rating: formattedGetObject.JobDetails.rating,
        skills: FormattedSkillsArray,
        title: formattedGetObject.JobDetails.title,
      }
      this.setState({
        jobDetailsData: formattedJobDetails,
        similarJobsData: formattedSimilarJobsData,
        skillsList: FormattedSkillsArray,
        lifeAtCompanyObj: formattedLifeAtCompanyObj,
        apiStatus: apiStatusConstants.success,
      })
    } else {
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
    const {
      jobDetailsData,
      similarJobsData,
      skillsList,
      lifeAtCompanyObj,
    } = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
    } = jobDetailsData
    return (
      <div className="job-item-whole-content-container">
        <div className="job-item-container">
          <div className="company-details-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="company-title">{title}</h1>
              <div className="rating-container">
                <IoStarSharp className="star-icon" />
                <p className="company-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-role-package-container">
            <div className="location-role-container">
              <div className="location-container">
                <MdLocationOn className="icon" />
                <p className="location-text">{location}</p>
              </div>
              <div className="employment-container">
                <BsBriefcaseFill className="icon" />
                <p className="employment-type-text">{employmentType}</p>
              </div>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="job-description-container">
              <div className="description-company-website-container">
                <h1 className="description-heading">Description</h1>
                <a href={companyWebsiteUrl} className="company-website">
                  Visit
                  <FiExternalLink />
                </a>
              </div>

              <p className="job-description">{jobDescription}</p>
            </div>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list-container">
              {skillsList.map(eachSkill => (
                <li className="skill-item-container" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill-img"
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company-container">
              <div className="about-life-at-company-container">
                <h1 className="life-at-company-heading">Life at Company</h1>
                <p className="life-at-company-description">
                  {lifeAtCompanyObj.description}
                </p>
              </div>
              <img
                src={lifeAtCompanyObj.imageUrl}
                alt="life at company"
                className="life-at-company-img"
              />
            </div>
          </div>
        </div>
        <div className="similar-job-item-container">
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-job-items-list-container">
            {similarJobsData.map(eachJobItem => (
              <SimilarJobItem eachJobItem={eachJobItem} key={eachJobItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJodDetailsItem = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJodDetailsItem()}
      </>
    )
  }
}

export default JobItemDetails
