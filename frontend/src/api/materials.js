import api from "./axios";

export const uploadMaterial = async (subjectId, topicId, file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/materials/upload?subject_id=${subjectId}&topic_id=${topicId}`,
    formData
  );

  return response.data;
};

export const getMaterials = async (topicId) => {
  const response = await api.get(
    `/materials/?topic_id=${topicId}`
  );

  return response.data;
};