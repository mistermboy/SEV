var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",
    tiles32_png: "res/tiles32.png",
    mapa1_tmx: "res/mapa1.tmx",
    moneda_png : "res/moneda.png",
    moneda_plist : "res/moneda.plist",
    jugador_caminar_png : "res/jugador_caminar.png",
    jugador_caminar_plist : "res/jugador_caminar.plist",
    jugador_saltar_png : "res/jugador_saltar.png",
    jugador_saltar_plist : "res/jugador_saltar.plist",
    jugador_impactado_png : "res/jugador_impactado.png",
    jugador_impactado_plist : "res/jugador_impactado.plist",
    boton_saltar_png: "res/boton_saltar.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}