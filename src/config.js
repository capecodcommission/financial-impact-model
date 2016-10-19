// Create api-root to insert into actions to easily access API function
export const API_ROOT = (process.env.NODE_ENV === 'production')
			? 'http://api.capecodcommission.org/v1/watershed/mvp/fim/'
			:'http://api.capecodcommission.org/v1/watershed/mvp/fim/'

export const CookieDomain = (process.env.NODE_ENV === 'production')
			? '.ccc.top'
			:''

