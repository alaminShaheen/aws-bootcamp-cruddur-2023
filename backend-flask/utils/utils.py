from constants.constants import AUTH_HTTP_HEADER


def extract_access_token(request_headers):
	access_token = None
	auth_header = request_headers.get(AUTH_HTTP_HEADER)
	if auth_header and " " in auth_header:
		_, access_token = auth_header.split()
	return access_token
