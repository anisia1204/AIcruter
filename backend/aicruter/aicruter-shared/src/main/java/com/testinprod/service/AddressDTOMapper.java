package com.testinprod.service;

import com.testinprod.domain.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressDTOMapper {
    public Address getEntityFromDTO(AddressDTO addressDTO) {
        Address address = new Address();
        address.setAddressLine(addressDTO.getAddressLine());
        address.setCity(addressDTO.getCity());
        address.setCountry(addressDTO.getCountry());
        address.setState(addressDTO.getState());
        address.setPostalCode(addressDTO.getPostalCode());
        return address;
    }

    public AddressDTO getDTOFromEntity(Address legalAddress) {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setAddressLine(legalAddress.getAddressLine());
        addressDTO.setCity(legalAddress.getCity());
        addressDTO.setCountry(legalAddress.getCountry());
        addressDTO.setState(legalAddress.getState());
        addressDTO.setPostalCode(legalAddress.getPostalCode());
        return addressDTO;
    }
}
