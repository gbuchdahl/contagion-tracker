class APIException(Exception):  # Abstract class. Should never be directly instatiated
    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["error"] = self.message
        rv["status_code"] = self.status_code
        return rv

    def get_status(self):
        return self.status_code


class DocumentNotFoundException(APIException):
    status_code = 404
    message = "Document not found"

    def __init__(self, status_code=None, payload=None):
        APIException.__init__(self, self.message, status_code, payload)


class InvalidDateException(APIException):
    status_code = 400
    message = "Invalid date format. Should be dd_mm_yyyy"

    def __init__(self, status_code=None, payload=None):
        APIException.__init__(self, self.message, status_code, payload)


class InvalidStateException(APIException):
    status_code = 406

    def __init__(self, state_code, status_code=None, payload=None):
        self.message = "Invalid state code: {}".format(state_code)
        APIException.__init__(self, self.message, status_code, payload)


class InvalidCountryException(APIException):
    status_code = 406

    def __init__(self, country_code, status_code=None, payload=None):
        self.message = "Invalid country code: {}".format(country_code)
        APIException.__init__(self, self.message, status_code, payload)


class InvalidRequestException(APIException):
    status_code = 405

    def __init__(self, request_type, status_code=None, payload=None):
        self.message = "{} request not valid at this endpoint".format(country_code)
        APIException.__init__(self, self.message, status_code, payload)


class UnknownRouteException(APIException):
    status_code = 404

    def __init__(self, route, status_code=None, payload=None):
        self.message = "No content found at {}".format(route)
        APIException.__init__(self, self.message, status_code, payload)


class InvalidWindowException(APIException):
    status_code = 400

    def __init__(self, window, status_code=None, payload=None):
        self.message = "Window size: {} not valid".format(window)
        APIException.__init__(self, self.message, status_code, payload)


class InvalidSizeException(APIException):
    status_code = 400

    def __init__(self, maxSize, status_code=None, payload=None):
        self.message = "maxSize: {} not valid".format(maxSize)
        APIException.__init__(self, self.message, status_code, payload)


class DatabaseError(Exception):
    pass
