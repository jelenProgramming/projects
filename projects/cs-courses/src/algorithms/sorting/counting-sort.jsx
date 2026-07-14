import SortViz from './SortViz.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'

export default function Page({ content }) {
  return (
    <>
      <SortViz slug="counting-sort" />
      <AlgoDetail content={content} />
    </>
  )
}
