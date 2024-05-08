import { useState } from "react";
import {
    View,
    StatusBar,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
    Modal
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Link, Redirect } from "expo-router"
import { MotiView } from "moti"

import { colors } from "@/styles/colors";
import { Header } from "@/components/header";
import { Credential } from "@/components/credential";
import { Button } from "@/components/button";
import { QRCode } from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store"


export default function Ticket() {
    const [expandQRCode, setExpandQRCode] = useState<boolean>(false)

    const badgeStore = useBadgeStore()

    async function handleSelectImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
            })

            if (result.assets) {
                badgeStore.updateAvatar(result.assets[0].uri)
            }
        } catch (error) {
            console.log(error)
            Alert.alert("Foto", "Não foi possível selecionar a imagem.")
        }
    }

    if (!badgeStore.data?.checkInURL) {
        return <Redirect href="/" />
    }

    async function handleShare() {
        try {
            if (badgeStore.data?.checkInURL) {
                await Share.share({
                    message: badgeStore.data.checkInURL,
                })
            }
        } catch (error) {
            console.log(error)
            Alert.alert("Compartilhar", "Não foi possível compartilhar")
        }
    }

    return (
        <View className="flex-1 bg-green-500">
            <StatusBar barStyle="light-content" />
            <Header title="Minha credencial" />
            <ScrollView
                className="-mt-28 -z-10"
                contentContainerClassName="px-8 pb-8"
                showsVerticalScrollIndicator={false}
            >
                <Credential
                    data={badgeStore.data}
                    onChangeAvatar={handleSelectImage}
                    onExpandQRCode={() => setExpandQRCode(true)}
                />

                <MotiView
                    from={{
                        translateY: 0
                    }}
                    animate={{
                        translateY: 10
                    }}
                    transition={{
                        loop: true,
                        type: "timing",
                        duration: 700
                    }}
                >
                    <FontAwesome
                        name="angle-double-down"
                        size={24}
                        color={colors.gray[300]}
                        className="self-center my-6"
                    />
                </MotiView>

                <Text className="text-white font-bold text-2xl mt-4">Compartilhar credencial</Text>
                <Text className="text-white font-regular text-base mt-1 mb-6">
                    Mostre ao mundo que você vai participar do {badgeStore.data.eventTitle}
                </Text>

                <Button title="Compartilhar" onPress={handleShare} />

                <TouchableOpacity
                    activeOpacity={0.9}
                    className="mt-10"
                    onPress={() => badgeStore.remove()}
                >
                    <Text className="text-base text-white font-bold text-center">Remover ingresso</Text>
                </TouchableOpacity>


            </ScrollView>

            {/* Modal para ampliar QRCode */}
            <Modal
                visible={expandQRCode}
                statusBarTranslucent={true}
                animationType="fade"
            >
                <View className="flex-1 bg-green-500 items-center justify-center">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setExpandQRCode(false)}
                    >
                        <QRCode value="test" size={300} />
                        <Text className="font-body text-orange-500 font-bold text-sm mt-10 text-center">Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    )
}