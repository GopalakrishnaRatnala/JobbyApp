import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({component: Component, ...rest}) => {
  const token = Cookies.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <Route {...rest} render={props => <Component {...props} {...rest} />} />
  )
}

export default ProtectedRoute
