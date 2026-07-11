package net.booksnap.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class Utils {
    private final ObjectMapper objectMapper;

    public Utils(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ObjectNode filterFields(Object dto, String fields) {

            JsonNode fullNode = objectMapper.valueToTree(dto);
            ObjectNode filteredNode = objectMapper.createObjectNode();

            Set<String> requestedFields = new HashSet<>(Arrays.asList(fields.split(",")));

            for (String field : requestedFields) {
                String trimmedField = field.trim();
                if (fullNode.has(trimmedField)) {
                    filteredNode.set(trimmedField, fullNode.get(trimmedField));
                }
            }
            return filteredNode;
    }
}
