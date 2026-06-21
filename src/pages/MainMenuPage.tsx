import { Link } from 'react-router-dom'
import hero from '../assets/hero.png'

export function MainMenuPage() {
  return (
    <main>
      <section className="hero menu-hero">
        <div>
          <p className="eyebrow">Return loaded. Waste avoided.</p>
          <h1>Choose your CargoLink workspace.</h1>
          <p>
            Explore the demo as a verified commercial carrier or as an SME
            looking for compatible return-trip capacity.
          </p>
          <div className="role-menu" aria-label="Choose a demo role">
            <Link className="role-card carrier-role" to="/carrier">
              <span className="role-icon">C</span>
              <span>
                <strong>Log in as Carrier</strong>
                <small>Publish and manage spare return capacity</small>
              </span>
            </Link>
            <Link className="role-card sme-role" to="/sme">
              <span className="role-icon">S</span>
              <span>
                <strong>Log in as SME</strong>
                <small>Post shipments and find ranked matches</small>
              </span>
            </Link>
          </div>
          <p className="demo-note">
            No credentials are required. These controls only select a demo
            workspace.
          </p>
        </div>
        <img src={hero} alt="Commercial truck travelling on a highway" />
      </section>
    </main>
  )
}
