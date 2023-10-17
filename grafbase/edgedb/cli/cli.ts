import { splitUrlByProtocol } from "../../lib/util"
import { addGlobalLink } from "../crud/global-link"
import {
  addLinkToSectionOfGlobalTopic,
  createGlobalTopicWithGlobalGuide,
  getGlobalTopic,
  moveAllLinksOfGlobalTopicToSectionOther,
  updatePrettyNameOfGlobalTopic
} from "../crud/global-topic"
import {
  Topic,
  findFilePath,
  markdownFilePaths,
  parseMdFile
} from "../sync/markdown"

function toTitleCase(inputStr: string) {
  // Split the string by hyphen and convert each segment to title case
  const segments = inputStr
    .split("-")
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    )

  // Join the segments with a space
  return segments.join(" ")
}

async function main() {
  // const topic = await getGlobalTopic(hankoId, "3d-printing")
  // console.log(topic)
  // await updatePrettyNameOfGlobalTopic("music-albums", "Music Albums")
  const hankoId = process.env.LOCAL_USER_HANKO_ID!
  const res = await getGlobalTopic("guitar", hankoId)
  console.dir(res, { depth: null })
  return
  const paths = await getMarkdownPaths()
  const parts = paths[15]!.split("/")
  const fileName = parts[parts.length - 1] // Get the last part which is the filename
  const topicName = fileName!.split(".")[0]
  console.log(topicName)
  const prettyName = toTitleCase(topicName!)
  // const prettyName = ""
  return

  await createGlobalTopicWithGlobalGuide(topicName!, prettyName, "")
  await processLinksFromMarkdownFilesAsGlobalLinks(topicName!)
  await moveLinksFromSectionsToGuide(topicName!)
  await moveAllLinksOfGlobalTopicToSectionOther(topicName!)
  console.log("done")
}

await main()

async function getMarkdownPaths() {
  const paths = await markdownFilePaths(process.env.wikiFolderPath!, [])
  return paths
  // console.log(paths[0])
  // const filePath = paths[0]!
  // const topic = await parseMdFile(filePath)
  // console.log(topic, "topic")
}

async function getTopicByFileName(fileName: string) {
  const filePath = await findFilePath(
    process.env.wikiFolderPath!,
    fileName + ".md"
  )
  if (filePath) {
    const topic = await parseMdFile(filePath)
    return topic
  }
}

async function moveLinksFromSectionsToGuide(fileName: string) {
  const filePath = await findFilePath(
    process.env.wikiFolderPath!,
    fileName + ".md"
  )
  if (filePath) {
    const topic = await parseMdFile(filePath)
    await processLinksBySection(topic)
  }
}

async function processLinksFromMarkdownFilesAsGlobalLinks(fileName: string) {
  const filePath = await findFilePath(
    process.env.wikiFolderPath!,
    fileName + ".md"
  )
  if (filePath) {
    const topic = await parseMdFile(filePath)
    await processLinks(topic)
  }
}

async function processLinksBySection(topic: Topic) {
  for (const link of topic.links) {
    if (link.section) {
      const [urlWithoutProtocol, protocol] = splitUrlByProtocol(link.url)
      if (urlWithoutProtocol && protocol) {
        await addLinkToSectionOfGlobalTopic(
          topic.name,
          link.section,
          urlWithoutProtocol
        )
      }
    }
  }
}

async function processLinks(topic: Topic) {
  topic.links.map(async (link) => {
    await addGlobalLink(
      link.url,
      link.title,
      link.year,
      link.description,
      topic.name
    )
  })
}

// async function processNotesFromMarkdownFilesAsGlobalNotes(fileName: string) {
//   const filePath = await findFilePath(
//     process.env.wikiFolderPath!,
//     fileName + ".md"
//   )
//   if (filePath) {
//     const topic = await parseMdFile(filePath)
//     // console.log(topic.topicAsMarkdown, "topic")
//     // console.log(topic.notes, "notes")
//     await processNotes(topic)
//   }
// }

// async function processNotes(topic: Topic) {
//   topic.notes.map(async (note) => {
//     console.log(note, "note")
//     // await addGlobalNote(note.content, note.url, topic.name)
//   })
// }

// TODO: move it away after release, is here as reference in trying to get all the topics ported for release
async function oneOffActions() {
  // await processLinksFromMarkdownFilesAsGlobalLinks(topicName!)
  // const res = await getUserDetails(hankoId)
  // console.log(res, "res")
  // const res = await updateTopicLearningStatus(
  //   hankoId,
  //   "asking-questions",
  //   "none"
  // )
  // const res = await updateGlobalLinkStatus(
  //   hankoId,
  //   "c29b845c-45ea-11ee-aedd-ffb76be6287b",
  //   "uncomplete"
  // )
  // const res = await getGlobalTopic("asking-questions", hankoId)
  // console.dir(res, { depth: null })
  // console.log(res)
  // const paths = await getMarkdownPaths()
  // const parts = paths[0]!.split("/")
  // const fileName = parts[parts.length - 1] // Get the last part which is the filename
  // const topicName = fileName!.split(".")[0]
  // console.log(topicName)
  // const email = "nikita@nikiv.dev"
  // const timestamp = 1923428131
  // const iso8601_format = new Date(timestamp * 1000)
  // console.log(iso8601_format)
  // const res = await client.querySingle(
  //   `
  //   update User
  //   filter .email = <str>$email
  //   set {
  //     memberUntil:= <datetime>$iso8601_format
  //   }
  // `,
  //   { email, iso8601_format }
  // )
  // console.log(res, "res")
  // const timestamp = 1684010131
  // await updateMemberUntilOfUser(email, timestamp)
  // const topic = await getTopicByFileName("3d-printing")
  // console.log(topic?.name)
  // const topic = {
  //   name: "3d-printing",
  //   prettyName: "3D Printing",
  //   topicSummary:
  //     "3D printing or additive manufacturing is the construction of a three-dimensional object from a CAD model or a digital 3D model.",
  //   sections: [
  //     {
  //       title: "Intro",
  //       summary: "Intro to 3D printing",
  //       linkIds: [],
  //     },
  //     {
  //       title: "Other",
  //       summary: "Other links",
  //       linkIds: [],
  //     },
  //   ],
  // } as GlobalTopic
  // await updateGlobalTopic(process.env.LOCAL_USER_HANKO_ID!, topic)
  // TODO: complete moving notes
  // await processNotesFromMarkdownFilesAsGlobalNotes("asking-questions")
  // await getMarkdownPaths()
  // const topic = await getTopic("3d-printing")
  // console.log("done")
  // const links = await getAllGlobalLinksForTopic("3d-printing")
  // console.log(links, "links")
  // const globalTopic = await getGlobalTopic("3d-printing")
  // console.log(globalTopic.links, "links")
  // console.log(globalTopic.prettyName, "pretty name")
  // await removeTrailingSlashFromGlobalLinks()
  // console.log("done")
  // const links = await updateAllGlobalLinksToHaveRightUrl()
  // console.log(links, "links")
  // console.log("done")
  // console.log("done")
  // const link = await getGlobalLink()
  // console.log(link)
  // const links = await getAllGlobalLinks()
  // console.log(links, "links")
  // await removeDuplicateUrls()
  // await attachGlobalLinkToGlobalTopic(
  //   "https://www.mikeash.com/getting_answers.html",
  //   "asking-questions",
  // )
  // // console.log(topic.name)
  // await createGlobalTopicWithGlobalGuide(topic.name, topic.prettyName, "")
  // const links = await getAllGlobalLinks()
  // console.log(links, "links")
  // await updateTopicLearningStatus(
  //   process.env.LOCAL_USER_HANKO_ID!,
  //   "3d-printing",
  //   "learning",
  // )
  // let today = new Date()
  // let nextMonth = today.getMonth() + 1
  // let nextYear = today.getFullYear()
  // let nextMonthDate = new Date(nextYear, nextMonth, today.getDate())
  // await updateUserMemberUntilDate(
  //   process.env.LOCAL_USER_HANKO_ID!,
  //   nextMonthDate,
  // )
}
