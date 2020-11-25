import BrowseLayout from '@/screens/browse/BrowseLayout.tsx'

export default function BrowseKeywordsScreen(): JSX.Element {
  return (
    <BrowseLayout
      breadcrumb={{
        pathname: '/browse/keyword',
        label: 'Browse',
      }}
      title="Browse keywords"
      facet="keyword"
    />
  )
}
