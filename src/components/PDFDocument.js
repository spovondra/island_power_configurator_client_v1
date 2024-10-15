import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image
} from "@react-pdf/renderer";

// Styles for the PDF document
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#FFF",
        padding: 30,
    },
    header: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    text: {
        fontSize: 12,
        marginBottom: 10,
    },
    chart: {
        width: "100%",
        height: 200,
        marginBottom: 20,
    },
});

// PDF document component
const PDFDocument = ({ project, site, appliances, configuration, chartImages }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>Final System Overview</Text>

                {/* Project Information */}
                <View style={styles.section}>
                    <Text>Project Information</Text>
                    <Text style={styles.text}>Project ID: {project?.id || "N/A"}</Text>
                    <Text style={styles.text}>Project Name: {project?.name || "N/A"}</Text>
                    <Text style={styles.text}>User ID: {project?.userId || "N/A"}</Text>
                </View>

                {/* Site Information */}
                <View style={styles.section}>
                    <Text>Site Information</Text>
                    <Text style={styles.text}>Latitude: {site.latitude || "N/A"}</Text>
                    <Text style={styles.text}>Longitude: {site.longitude || "N/A"}</Text>
                    <Text style={styles.text}>Min Temperature: {site.minTemperature || "N/A"} °C</Text>
                    <Text style={styles.text}>Max Temperature: {site.maxTemperature || "N/A"} °C</Text>
                </View>

                {/* Appliances Information */}
                <View style={styles.section}>
                    <Text>Appliances</Text>
                    {appliances.map(appliance => (
                        <View key={appliance.id} style={styles.text}>
                            <Text>{appliance.name}</Text>
                            <Text>Power: {appliance.power} W</Text>
                            <Text>Quantity: {appliance.quantity}</Text>
                            <Text>Energy: {appliance.energy} Wh</Text>
                        </View>
                    ))}
                </View>

                {/* Configuration */}
                <View style={styles.section}>
                    <Text>Configuration Model</Text>
                    <Text style={styles.text}>
                        Total AC Energy: {configuration?.projectAppliance?.totalAcEnergy || "N/A"} Wh
                    </Text>
                    <Text style={styles.text}>
                        Total DC Energy: {configuration?.projectAppliance?.totalDcEnergy || "N/A"} Wh
                    </Text>
                    <Text style={styles.text}>
                        System Voltage: {configuration.systemVoltage || "N/A"} V
                    </Text>
                    <Text style={styles.text}>
                        Recommended System Voltage: {configuration.recommendedSystemVoltage || "N/A"} V
                    </Text>
                </View>

                {/* Captured Chart Images */}
                {chartImages.map((chartSrc, index) => (
                    <Image key={index} src={chartSrc} style={styles.chart} />
                ))}
            </Page>
        </Document>
    );
};

export default PDFDocument;
