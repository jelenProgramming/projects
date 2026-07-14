import StringMatchViz from './StringMatchViz.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
export default function Page({ content }) {
  return (<><StringMatchViz slug="kmp" /><AlgoDetail content={content} /></>)
}
