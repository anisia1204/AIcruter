import { getToken } from "./authToken";

export const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type BodyType = Record<string, any> | FormData;

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unknown error');
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json')
    ? response.json()
    : response.text();
};

const buildHeaders = async (
  isJson: boolean,
  isFormData: boolean
): Promise<HeadersInit> => {
  
  const token = await getToken();
  const headers: HeadersInit = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (isJson) headers['Content-Type'] = 'application/json';
  if (isFormData) delete headers['Content-Type'];

  return headers;
};

const request = async (
  path: string,
  method: HttpMethod,
  body?: BodyType,
  isFormData: boolean = false
): Promise<any> => {
  const isJson = !isFormData && body !== undefined;
  const headers = await buildHeaders(isJson, isFormData);

  const config: RequestInit = {
    method,
    headers,
    ...(body
      ? { body: isFormData ? (body as FormData) : JSON.stringify(body) }
      : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, config);
  return handleResponse(response);
};


export const apiGet = (path: string) => request(path, 'GET');

export const apiPost = (path: string, body: Record<string, any>) => request(path, 'POST', body);

export const apiUpdate = (path: string, body: Record<string, any>) => request(path, 'PUT', body);

export const apiDelete = (path: string) => request(path, 'DELETE');
