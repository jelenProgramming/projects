import { MapPin, Building2, Link as LinkIcon, CalendarDays } from 'lucide-react'

function fmtDate(iso, lang) {
  return new Date(iso).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    year: 'numeric',
    month: 'short',
  })
}

export default function ProfileCard({ user, t }) {
  const lang = t.joined === 'dabei seit' ? 'de' : 'en'
  return (
    <section className="profile">
      <img className="profile__avatar" src={user.avatar_url} alt={user.login} />
      <div className="profile__body">
        <h2 className="profile__name">{user.name || user.login}</h2>
        <a className="profile__login" href={user.html_url} target="_blank" rel="noreferrer">
          @{user.login}
        </a>
        {user.bio && <p className="profile__bio">{user.bio}</p>}
        <ul className="profile__meta">
          {user.location && <li><MapPin className="meta-ico" aria-hidden="true" /> {user.location}</li>}
          {user.company && <li><Building2 className="meta-ico" aria-hidden="true" /> {user.company}</li>}
          {user.blog && (
            <li>
              <LinkIcon className="meta-ico" aria-hidden="true" />{' '}
              <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                {user.blog.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}
          <li><CalendarDays className="meta-ico" aria-hidden="true" /> {t.joined} {fmtDate(user.created_at, lang)}</li>
        </ul>
      </div>
    </section>
  )
}
