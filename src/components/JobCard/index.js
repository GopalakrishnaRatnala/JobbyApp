import './index.css'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoStarSharp} from 'react-icons/io5'
import {Link} from 'react-router-dom'

const JobCard = props => {
  const {eachJobItem} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = eachJobItem
  return (
    <li className="job-list-item-container">
      <Link to={`/jobs/${id}`} className="link-item">
        <div className="company-details-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <div className="job-description-container">
          <h1 className="description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobCard
