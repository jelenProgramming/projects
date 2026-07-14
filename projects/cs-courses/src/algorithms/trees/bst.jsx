import { useState, useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import TreeSVG from './TreeSVG.jsx'
import { useLang } from '../../i18n.jsx'
import { buildBST } from './bstAlgo.js'

export default function Page({ content }) {
  const { tk, t } = useLang()
  const [values, setValues] = useState([50, 30, 70, 20, 40, 60, 80, 35])
  const [search, setSearch] = useState(60)
  const [valInput, setValInput] = useState('50,30,70,20,40,60,80,35')
  const [searchInput, setSearchInput] = useState('60')

  const steps = useMemo(() => buildBST(values, search), [values, search])
  const player = usePlayer(steps, { speed: 1.1 })
  const s = player.step

  const apply = () => {
    const nums = valInput.split(/[ ,]+/).map((x) => parseInt(x, 10)).filter((x) => !isNaN(x))
    if (nums.length) setValues(nums.slice(0, 31))
    const sv = parseInt(searchInput, 10)
    if (!isNaN(sv)) setSearch(sv)
  }

  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'flex-start', minHeight: 360 }}>
          <TreeSVG nodes={s.nodes || []} maxY={s.maxY || 1} active={s.active} inserting={s.inserting} searching={s.searching} found={s.found} />
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>

      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="field-label">{t({ en: 'Values to insert (in order)', de: 'Einzufuegende Werte (der Reihe nach)' })}</label>
            <input type="text" value={valInput} onChange={(e) => setValInput(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label className="field-label">{t({ en: 'Search for', de: 'Suche nach' })}</label>
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ width: 90 }} />
          </div>
          <button className="btn" onClick={apply} style={{ alignSelf: 'flex-end' }}>{tk('apply')}</button>
        </div>
      </div>

      <AlgoDetail content={content} />
    </div>
  )
}
