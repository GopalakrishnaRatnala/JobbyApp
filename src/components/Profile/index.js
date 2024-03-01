import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {profileData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
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
      const profileObject = data.profile_details
      const formattedProfileData = {
        name: profileObject.name,
        profileImageUrl: profileObject.profile_image_url,
        shortBio: profileObject.short_bio,
      }
      this.setState({
        profileData: formattedProfileData,
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
      <Link to="/jobs">
        <button type="button" className="retry-button">
          Retry
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {profileData} = this.state

    return (
      <div className="profile-container">
        <img
          src={profileData.profileImageUrl}
          alt="profile"
          className="profile-pic"
        />
        <h1 className="name">{profileData.name}</h1>
        <p className="short-bio">{profileData.shortBio}</p>
      </div>
    )
  }

  render() {
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
}

export default Profile
