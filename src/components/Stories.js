import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import styled from 'styled-components'
import parser from 'url'

import Time from '../components/Time'
// import Navigation from '../components/Navigation'

const Main = styled.div`
  margin: 0;
`

const Story = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 0;
  line-height: 18px;
  /* Give each story more room */
  margin-bottom: 0.5rem;

  &:hover {
    background-color: #ffc6001a;
  }
`
const Rank = styled.span`
  color: #ccc;
  font-size: 1.2rem;
  width: 35px;
  margin-right: 10px;
  display: flex;
  justify-content: flex-start;
  margin-right: 2rem;
`

const Content = styled.div``
const Header = styled.div``
const Body = styled.div``

const Meta = styled.div`
  font-size: 0.7rem;
  color: #828282;
`

const Host = Meta.extend``

// Use gatsby-plugin-google-analytics plugin to track outbound clicks
// https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-google-analytics#outboundlink-component
const BaseLink = styled(OutboundLink).attrs({
  target: '_blank',
})`
  &:link {
    text-decoration: none;
  }
  &:hover {
    text-decoration: underline;
  }
  &:visited {
    color: #ddd;
  }
`
const TitleLink = BaseLink.extend`
  color: #464134;
  cursor: pointer;
`

const HostLink = BaseLink.extend`
  font-size: 0.7rem;
  color: #828282;
  margin-left: 5px;
`

const CommentLink = HostLink.extend`
  margin: 0;
`

const FilterByDateContainer = styled.div`
  margin-bottom: 15px;
`

const FilterByDateSelect = styled.select`
  display: inline-block;
  border-width: 1px;
  border-color: rgb(222, 226, 230);
  border-style: solid;
  border-radius: 0.25rem;
  padding: 0.175rem 1rem 0.175rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: rgb(33, 37, 41);
`

const FilterByDateOption = ({ onChange }) => (
  <FilterByDateContainer>
    <span>Posted up to </span>
    <FilterByDateSelect onChange={onChange}>
      <option key="0" value="0">
        ∞
      </option>
      <option key="1" value="1">
        A Day Ago
      </option>
      <option key="2" value="2">
        Two Days Ago
      </option>
      <option key="3" value="3">
        Three Days Ago
      </option>
      <span> ago</span>
    </FilterByDateSelect>
  </FilterByDateContainer>
)

class Stories extends React.Component {
  static SHOW_ALL_DATES = 0
  static SECONDS_IN_MILLISECONDS = 1000
  static NOW = new Date()

  state = {
    stories: this.props.stories,
    showDaysUpto: Stories.SHOW_ALL_DATES,
  }

  // For filtering null node items while building stories
  nullNodeItems = ({ node }) => node.item !== null

  // For filtering by dates while building stories
  byDates = ({ node }, index) => {
    const { showDaysUpto } = this.state

    if (showDaysUpto === 0) return true
    else {
      const postDate = new Date(
        node.item.time * Stories.SECONDS_IN_MILLISECONDS
      )
      const hoursDifference = Math.abs(Stories.NOW - postDate) / 36e5

      return hoursDifference <= showDaysUpto * 24
    }
  }

  buildStoriesComponents = () => {
    const { stories } = this.state

    return stories
      .filter(this.nullNodeItems)
      .filter(this.byDates)
      .map(({ node }, index) => {
        const { title, score, by, time, type, url } = node.item

        const commentLink = `//news.ycombinator.com/item?id=${node.storyId}`
        const host = parser.parse(url || '').host
        // Some stories (Jobs, ASK, etc) don't have URLs then use comment URL
        const titleUrl = url || commentLink

        const date = new Date(time * Stories.SECONDS_IN_MILLISECONDS)
        const rank = (index + 1).toString().padStart(3, '0')

        return (
          <Story key={node.id}>
            <Rank>{rank}</Rank>
            <Content>
              <Body>
                <TitleLink href={titleUrl}>{title}</TitleLink>
                {host ? <HostLink href={`//${host}`}>({host})</HostLink> : null}
              </Body>
              <Meta>
                {score} points by {by} [<Time date={date} />]
                <HostLink href={`${commentLink}`}>[comments]</HostLink>
              </Meta>
            </Content>
          </Story>
        )
      })
  }

  handleDateFilter = e => {
    this.setState({ showDaysUpto: parseInt(e.target.value) })
  }

  render() {
    const storiesComponents = this.buildStoriesComponents()

    return (
      <div>
        {/* <Navigation /> */}
        {/* <FilterByDateOption onChange={this.handleDateFilter} /> */}
        {storiesComponents}
      </div>
    )
  }
}

export default Stories
