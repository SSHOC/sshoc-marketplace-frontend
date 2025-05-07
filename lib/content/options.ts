export const figureAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

export type FigureAlignment = (typeof figureAlignments)[number]["value"];

export const gridAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

export type GridAlignment = (typeof gridAlignments)[number]["value"];

export const gridLayouts = [
	{ label: "Two columns", value: "two-columns" },
	{ label: "Three columns", value: "three-columns" },
	{ label: "Four columns", value: "four-columns" },
	{ label: "Two columns, right is 2x as wide", value: "one-two-columns" },
	{ label: "Two columns, right is 3x as wide", value: "one-three-columns" },
	{ label: "Two columns, right is 4x as wide", value: "one-four-columns" },
] as const;

export type GridLayout = (typeof gridLayouts)[number]["value"];

export const linkKinds = [
	{ label: "About pages", value: "about-pages" },
	{ label: "Contribute pages", value: "contribute-pages" },
	{ label: "Contact page", value: "contact-page" },
	{ label: "Current page", value: "current-page" },
	{ label: "Download", value: "download" },
	{ label: "Email", value: "email" },
	{ label: "External", value: "external" },
	{ label: "Search page", value: "search-page" },
] as const;

export type LinkKind = (typeof linkKinds)[number]["value"];

export const socialMediaKinds = [
	{ label: "Bluesky", value: "bluesky" },
	{ label: "Email", value: "email" },
	{ label: "Facebook", value: "facebook" },
	{ label: "Flickr", value: "flickr" },
	{ label: "GitHub", value: "github" },
	{ label: "LinkedIn", value: "linkedin" },
	{ label: "Mastodon", value: "mastodon" },
	{ label: "ORCID", value: "orcid" },
	{ label: "RSS Feed", value: "rss" },
	{ label: "Twitter", value: "twitter" },
	{ label: "Website", value: "website" },
	{ label: "YouTube", value: "youtube" },
] as const;

export type SocialMediaKind = (typeof socialMediaKinds)[number]["value"];

export const videoProviders = [{ label: "YouTube", value: "youtube" }] as const;

export type VideoProvider = (typeof videoProviders)[number]["value"];
