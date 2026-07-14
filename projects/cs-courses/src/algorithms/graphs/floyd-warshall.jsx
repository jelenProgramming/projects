import GraphViz from './GraphViz.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'

export default function Page({ content }) {
  return (
    <>
      <GraphViz slug="floyd-warshall" />
      <AlgoDetail content={content} />
    </>
  )
}
