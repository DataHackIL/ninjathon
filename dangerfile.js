import {fail, warn, success, danger} from "danger"

// Global variables and constants
let allSystemsCheck = true

const body = danger.github.pr.body
const title = danger.github.pr.title

// Should mention an active issue
const mentionsActiveIssue = !!body.match(/#(\d+)/)
allSystemsCheck &= mentionsActiveIssue
if (!mentionsActiveIssue) warn('Should mention active issue in the PR body, i.e #4')

// Should have correct title format
const titleFormat = /[A-Z]\w+: [A-z].*?\./
const usesCorrectTitleFormat = !!title.match(titleFormat)
allSystemsCheck &= usesCorrectTitleFormat
if (!usesCorrectTitleFormat) warn(`Title format should follow 'Subject: What I changed.'`)

// Should have at least 2 reviewers
const reviews = danger.github.reviews
const approvingReviewers = new Set(reviews.filter(r => r.state = 'APPROVED').map(r => r.user.id))
const hasTwoApprovingReviews = approvingReviewers.size > 1
allSystemsCheck &= hasTwoApprovingReviews
if (!hasTwoApprovingReviews) warn('You need at least 2 reviews (including production reviewer)')

// Should be reviewed by production reviewer
const productionReviewers = ['shakedlokits']
const approvedByProductionReviewer = reviews.filter(r => productionReviewers.includes(r.user.login)).length > 0
allSystemsCheck &= approvedByProductionReviewer
if (!approvedByProductionReviewer) fail('Merging requires a review by a production reviewer')

if (allSystemsCheck) success('All systems check! ready to merge (:')