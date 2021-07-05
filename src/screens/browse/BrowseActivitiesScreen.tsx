import BrowseLayout from '@/screens/browse/BrowseLayout'

export default function BrowseActivitiesScreen(): JSX.Element {
  return (
    <BrowseLayout
      breadcrumb={{
        pathname: '/browse/activity',
        label: 'Browse',
      }}
      title="Browse activities"
      facet="activity"
    />
  )
}
