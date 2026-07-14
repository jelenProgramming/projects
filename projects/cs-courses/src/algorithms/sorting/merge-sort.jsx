import SortViz from './SortViz.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'

export default function Page({ content }) {
  return (
    <>
      <SortViz slug="merge-sort" />
      <AlgoDetail content={content} />
    </>
  )
}
