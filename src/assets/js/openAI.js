export async function checkStatus(callback){
    let statusPage = new StatusPage.page({ page : 'jbxzcdv9xc4d' })
    
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get("preview");

    !preview && statusPage.components({
        success: function(data) {
          data.components.forEach(component => {
            if (component.name == "API"){
                component.status !== "operational" && callback()
            }
          })
        }
    })
}