import React from 'react'
import { Link } from 'gatsby'
import Layout from 'components/common/Layout'
import SEO from 'components/common/Seo'

export default () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <div className="container center-text">
      <h1>Best movies around, ranked!</h1>
      <Link to="/app/">Proceed to sign in</Link>
    </div>
  </Layout>
)
