// CONTENT aggregate - merges per-category content modules into one lookup keyed
// by registry slug.
import { sortingGraphsContent } from './content/sortingGraphs.js'
import { treesContent } from './content/treesStructures.js'
import { algosExtraContent } from './content/algosExtra.js'
import { mathCoreContent } from './content/mathCore.js'
import { csCoreContent } from './content/csCore.js'
import { vizExtraContent } from './content/vizExtra.js'
import { araExtraContent } from './content/araExtra.js'
import { prog2Content } from './content/prog2.js'
import { webContent } from './content/web.js'
import { extraTopicsContent } from './content/extraTopics.js'
import { deepContent } from './content/deep.js'
import { prog1Content } from './content/prog1.js'

export const CONTENT = {
  ...sortingGraphsContent,
  ...treesContent,
  ...algosExtraContent,
  ...mathCoreContent,
  ...csCoreContent,
  ...vizExtraContent,
  ...araExtraContent,
  ...prog2Content,
  ...webContent,
  ...extraTopicsContent,
  ...deepContent,
  ...prog1Content,
}
