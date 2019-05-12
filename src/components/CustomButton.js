import React from 'react'
import { 
    StyleSheet
} from 'react-native'

import { Button} from 'react-native-elements'

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderWidth: 3.5,
        marginTop: 0,
        borderRadius: 25,
        borderColor:'rgb(45,93,124)'
      },
      buttonTitleStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily:'ProductSans-Regular',
        color:'rgb(46,54,79)'
      },
})


const CustomButton = ({onPress, title, loading,customButtonStyle, customTitleStyle}) => (
    <Button 
        onPress={onPress} 
        buttonStyle={[styles.buttonStyle, customButtonStyle]}
        titleStyle={[styles.buttonTitleStyle, customTitleStyle]}
        loading={loading}
        loadingProps={{color:'rgb(45,93,124)'}}
        title={title} />
)

export default CustomButton