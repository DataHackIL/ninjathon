import {fail, warn, message, danger} from "danger"

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

// Should have at least one reviewer
const reviews = danger.github.reviews
const approvingReviewers = new Set(reviews.filter(r => r.state = 'APPROVED').map(r => r.user.id))
const atLeastOneApprovingReview = approvingReviewers.size > 0
allSystemsCheck &= atLeastOneApprovingReview
if (!atLeastOneApprovingReview) warn('You need at least one review (including production reviewer)')

// Should be reviewed by production reviewer
const productionReviewers = ['shakedlokits']
const isProductionReviewer = productionReviewers.includes(danger.github.pr.user.login)
const approvedByProductionReviewer = reviews.filter(r => productionReviewers.includes(r.user.login)).length > 0
allSystemsCheck &= approvedByProductionReviewer || isProductionReviewer
if (!approvedByProductionReviewer && !isProductionReviewer) fail('Merging requires a review by a production reviewer')

if (allSystemsCheck) message('All systems check! ready to merge (:')
