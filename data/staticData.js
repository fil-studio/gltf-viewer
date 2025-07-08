export default {
	// Get global "isProduction"
	isProduction: process.env.ELEVENTY_ENV === 'production',
	baseURL: "",
  title: "GLTF Viewer",
	description: "Drag & Drop GLTF + HDRI debugger"
}